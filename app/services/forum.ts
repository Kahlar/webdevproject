import { getCollection } from './mongodb';
import { ObjectId } from 'mongodb';

export interface ForumPost {
  _id?: string;
  title: string;
  content: string;
  authorName: string;
  authorId: string;
  likes: number;
  dislikes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ForumComment {
  _id?: string;
  postId: string;
  content: string;
  authorName: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostReaction {
  _id?: string;
  postId: string;
  userId: string;
  type: 'like' | 'dislike';
  createdAt: Date;
}

export class ForumService {
  static async getPosts(page = 1, limit = 10) {
    console.log(`Getting posts - Page: ${page}, Limit: ${limit}`);
    const collection = await getCollection('forum_posts');
    
    try {
      const [posts, total] = await Promise.all([
        collection
          .find({})
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .toArray(),
        collection.countDocuments()
      ]);

      console.log(`Retrieved ${posts.length} posts out of ${total} total posts`);
      return {
        posts: posts.map(post => ({
          ...post,
          _id: post._id.toString(),
          likes: post.likes || 0,
          dislikes: post.dislikes || 0
        })),
        total,
        page,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Error in getPosts:', error);
      throw error;
    }
  }

  static async createPost(post: any) {
    console.log('Creating new post:', { title: post.title, author: post.authorName });
    const collection = await getCollection('forum_posts');
    const now = new Date();
    
    try {
      const newPost = {
        ...post,
        authorName: post.authorName.trim() || 'Anonymous',
        likes: 0,
        dislikes: 0,
        createdAt: now,
        updatedAt: now
      };

      const result = await collection.insertOne(newPost);
      console.log('Post created successfully:', result.insertedId.toString());
      
      return {
        ...newPost,
        _id: result.insertedId.toString()
      };
    } catch (error) {
      console.error('Error in createPost:', error);
      throw error;
    }
  }

  static async getPostById(id: string) {
    const collection = await getCollection('forum_posts');
    return collection.findOne({ _id: new ObjectId(id) });
  }

  static async addReaction(postId: string, userId: string, type: 'like' | 'dislike') {
    const [postsCollection, reactionsCollection] = await Promise.all([
      getCollection('forum_posts'),
      getCollection('post_reactions')
    ]);

    const existingReaction = await reactionsCollection.findOne({
      postId,
      userId
    });

    if (existingReaction) {
      if (existingReaction.type === type) {
        // Remove reaction if clicking the same type
        await Promise.all([
          reactionsCollection.deleteOne({ _id: existingReaction._id }),
          postsCollection.updateOne(
            { _id: new ObjectId(postId) },
            { $inc: { [type + 's']: -1 } }
          )
        ]);
        console.log('👎 Reaction removed:', { postId, type });
        return { [type]: false };
      } else {
        // Change reaction type
        await Promise.all([
          reactionsCollection.updateOne(
            { _id: existingReaction._id },
            { $set: { type, updatedAt: new Date() } }
          ),
          postsCollection.updateOne(
            { _id: new ObjectId(postId) },
            { 
              $inc: { 
                [existingReaction.type + 's']: -1,
                [type + 's']: 1
              } 
            }
          )
        ]);
        console.log('🔄 Reaction changed:', { postId, from: existingReaction.type, to: type });
      }
    } else {
      // Add new reaction
      await Promise.all([
        reactionsCollection.insertOne({
          postId,
          userId,
          type,
          createdAt: new Date()
        }),
        postsCollection.updateOne(
          { _id: new ObjectId(postId) },
          { $inc: { [type + 's']: 1 } }
        )
      ]);
      console.log('👍 New reaction added:', { postId, type });
    }

    return { [type]: true };
  }

  static async getComments(postId: string) {
    console.log(`Getting comments for post: ${postId}`);
    const collection = await getCollection('forum_comments');
    
    try {
      const comments = await collection
        .find({ postId })
        .sort({ createdAt: -1 })
        .toArray();

      console.log(`Retrieved ${comments.length} comments for post ${postId}`);
      return comments.map(comment => ({
        ...comment,
        _id: comment._id.toString()
      }));
    } catch (error) {
      console.error('Error in getComments:', error);
      throw error;
    }
  }

  static async addComment(comment: any) {
    console.log('Adding new comment:', { postId: comment.postId, author: comment.authorName });
    const collection = await getCollection('forum_comments');
    const now = new Date();
    
    try {
      const newComment = {
        ...comment,
        authorName: comment.authorName.trim() || 'Anonymous',
        createdAt: now,
        updatedAt: now
      };

      const result = await collection.insertOne(newComment);
      console.log('Comment added successfully:', result.insertedId.toString());
      
      return {
        ...newComment,
        _id: result.insertedId.toString()
      };
    } catch (error) {
      console.error('Error in addComment:', error);
      throw error;
    }
  }

  static async getUserReaction(postId: string, userId: string) {
    const collection = await getCollection('post_reactions');
    const reaction = await collection.findOne({ postId, userId });
    return reaction?.type || null;
  }
} 