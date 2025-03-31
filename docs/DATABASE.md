# Database Schema Documentation

## Collections

### forum_posts
Collection for storing forum posts and discussions.

```typescript
interface ForumPost {
  _id: ObjectId;          // MongoDB ObjectId
  title: string;          // Post title
  content: string;        // Post content
  authorName: string;     // Display name of the author
  authorId: string;       // User ID of the author
  likes: number;          // Number of likes (default: 0)
  dislikes: number;       // Number of dislikes (default: 0)
  createdAt: Date;        // Creation timestamp
  updatedAt: Date;        // Last update timestamp
}
```

Indexes:
- `{ createdAt: -1 }` - For efficient post listing
- `{ authorId: 1 }` - For user's posts lookup

### forum_comments
Collection for storing comments on forum posts.

```typescript
interface ForumComment {
  _id: ObjectId;          // MongoDB ObjectId
  postId: string;         // Reference to forum_posts
  content: string;        // Comment content
  authorName: string;     // Display name of the author
  authorId: string;       // User ID of the author
  createdAt: Date;        // Creation timestamp
  updatedAt: Date;        // Last update timestamp
}
```

Indexes:
- `{ postId: 1, createdAt: -1 }` - For efficient comment listing by post

### post_reactions
Collection for storing user reactions to posts.

```typescript
interface PostReaction {
  _id: ObjectId;          // MongoDB ObjectId
  postId: string;         // Reference to forum_posts
  userId: string;         // User ID who reacted
  type: 'like' | 'dislike'; // Reaction type
  createdAt: Date;        // Reaction timestamp
}
```

Indexes:
- `{ postId: 1, userId: 1 }` - Unique compound index for user reactions

### eco_tips
Collection for storing eco-friendly tips and advice.

```typescript
interface EcoTip {
  _id: ObjectId;          // MongoDB ObjectId
  title: string;          // Tip title
  content: string;        // Tip content
  category: string;       // Tip category
  createdAt: Date;        // Creation timestamp
  updatedAt: Date;        // Last update timestamp
}
```

Indexes:
- `{ category: 1 }` - For category-based filtering
- `{ createdAt: -1 }` - For chronological listing

### carbon_calculations
Collection for storing user carbon footprint calculations.

```typescript
interface CarbonCalculation {
  _id: ObjectId;          // MongoDB ObjectId
  userId: string;         // User ID who calculated
  transportation: {
    car: number;          // Car emissions (kg CO2)
    bus: number;          // Bus emissions (kg CO2)
    train: number;        // Train emissions (kg CO2)
    plane: number;        // Plane emissions (kg CO2)
  };
  energy: {
    electricity: number;  // Electricity usage (kWh)
    gas: number;         // Gas usage (therms)
    water: number;       // Water usage (gallons)
  };
  waste: {
    recycling: number;   // Recycling amount (kg)
    landfill: number;    // Landfill amount (kg)
  };
  totalEmissions: number; // Total carbon emissions (kg CO2)
  createdAt: Date;       // Calculation timestamp
}
```

Indexes:
- `{ userId: 1, createdAt: -1 }` - For user's calculation history

## Relationships

1. Forum Posts and Comments:
   - One-to-many relationship between `forum_posts` and `forum_comments`
   - Comments are linked to posts via `postId`

2. Forum Posts and Reactions:
   - One-to-many relationship between `forum_posts` and `post_reactions`
   - Reactions are linked to posts via `postId`
   - Each user can have only one reaction per post (enforced by unique index)

3. Users and Content:
   - One-to-many relationship between users and their posts/comments
   - One-to-many relationship between users and their carbon calculations

## Data Integrity

1. Referential Integrity:
   - When a post is deleted, all associated comments and reactions are deleted
   - User IDs are validated against the authentication system

2. Data Validation:
   - All required fields must be present
   - String fields have maximum length limits
   - Numeric fields have minimum and maximum value constraints
   - Dates are stored in UTC format

## Backup and Recovery

1. Automated Backups:
   - Daily full database backups
   - Hourly incremental backups
   - Backups are stored for 30 days

2. Recovery Procedures:
   - Point-in-time recovery available
   - Automated recovery testing weekly
   - Manual recovery procedures documented

## Performance Considerations

1. Indexing Strategy:
   - Indexes on frequently queried fields
   - Compound indexes for common query patterns
   - Regular index usage monitoring

2. Query Optimization:
   - Pagination implemented for all list operations
   - Projection used to limit returned fields
   - Aggregation pipelines optimized for common operations

## Security

1. Access Control:
   - Database user with minimal required privileges
   - Connection string encryption
   - IP whitelisting for database access

2. Data Protection:
   - Sensitive data encryption at rest
   - Secure connection (TLS)
   - Regular security audits 