/*
  # Blog System Schema

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `slug` (text, unique)
      - `content` (text)
      - `excerpt` (text)
      - `cover_image` (text)
      - `author_id` (uuid, references profiles)
      - `status` (post_status)
      - `views_count` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `blog_post_likes`
      - `id` (uuid, primary key)
      - `post_id` (uuid, references blog_posts)
      - `user_id` (uuid, references profiles)
      - `created_at` (timestamp)
    
    - `blog_post_comments`
      - `id` (uuid, primary key)
      - `post_id` (uuid, references blog_posts)
      - `user_id` (uuid, references profiles)
      - `content` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `blog_post_tags`
      - `id` (uuid, primary key)
      - `post_id` (uuid, references blog_posts)
      - `name` (text)

  2. Security
    - Enable RLS on all tables
    - Add policies for:
      - Public read access to published posts
      - Authors can manage their own posts
      - Authenticated users can like posts
      - Authenticated users can comment on posts
      - Authors can manage their post tags

  3. Functions
    - Trigger to generate post slugs
    - Trigger to update post updated_at
*/

-- Create post status enum
CREATE TYPE post_status AS ENUM ('draft', 'published', 'archived');

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE,
  content text,
  excerpt text,
  cover_image text,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  status post_status DEFAULT 'draft',
  views_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blog_post_likes table
CREATE TABLE IF NOT EXISTS blog_post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Create blog_post_comments table
CREATE TABLE IF NOT EXISTS blog_post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blog_post_tags table
CREATE TABLE IF NOT EXISTS blog_post_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE,
  name text NOT NULL,
  UNIQUE(post_id, name)
);

-- Enable Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for blog_posts
CREATE POLICY "Public posts are viewable by everyone"
  ON blog_posts
  FOR SELECT
  USING (status = 'published');

CREATE POLICY "Authors can manage their own posts"
  ON blog_posts
  FOR ALL
  USING (auth.uid() = author_id);

-- Create policies for blog_post_likes
CREATE POLICY "Authenticated users can like posts"
  ON blog_post_likes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view post likes"
  ON blog_post_likes
  FOR SELECT
  USING (true);

CREATE POLICY "Users can remove their own likes"
  ON blog_post_likes
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for blog_post_comments
CREATE POLICY "Authenticated users can comment on posts"
  ON blog_post_comments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view comments"
  ON blog_post_comments
  FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own comments"
  ON blog_post_comments
  FOR ALL
  USING (auth.uid() = user_id);

-- Create policies for blog_post_tags
CREATE POLICY "Anyone can view tags"
  ON blog_post_tags
  FOR SELECT
  USING (true);

CREATE POLICY "Authors can manage their post tags"
  ON blog_post_tags
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM blog_posts
      WHERE id = blog_post_tags.post_id
      AND author_id = auth.uid()
    )
  );

-- Create function to generate slugs
CREATE OR REPLACE FUNCTION generate_slug()
RETURNS trigger AS $$
DECLARE
  base_slug text;
  final_slug text;
  counter integer;
BEGIN
  -- Convert title to lowercase and replace spaces/special chars with hyphens
  base_slug := lower(regexp_replace(NEW.title, '[^a-zA-Z0-9]+', '-', 'g'));
  -- Remove leading/trailing hyphens
  base_slug := trim(both '-' from base_slug);
  
  final_slug := base_slug;
  counter := 1;
  
  -- Check if slug exists and append number if it does
  WHILE EXISTS (
    SELECT 1 FROM blog_posts WHERE slug = final_slug AND id != NEW.id
  ) LOOP
    final_slug := base_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;
  
  NEW.slug := final_slug;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for slug generation
CREATE TRIGGER generate_post_slug
  BEFORE INSERT OR UPDATE OF title
  ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION generate_slug();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE
  ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_comments_updated_at
  BEFORE UPDATE
  ON blog_post_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS blog_posts_author_id_idx ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS blog_posts_status_idx ON blog_posts(status);
CREATE INDEX IF NOT EXISTS blog_posts_created_at_idx ON blog_posts(created_at);
CREATE INDEX IF NOT EXISTS blog_post_likes_post_id_idx ON blog_post_likes(post_id);
CREATE INDEX IF NOT EXISTS blog_post_comments_post_id_idx ON blog_post_comments(post_id);
CREATE INDEX IF NOT EXISTS blog_post_tags_post_id_idx ON blog_post_tags(post_id);
CREATE INDEX IF NOT EXISTS blog_post_tags_name_idx ON blog_post_tags(name);