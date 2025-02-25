/*
  # Discussion Forum Schema

  1. New Tables
    - `discussions`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `content` (text, required)
      - `author_id` (uuid, references profiles)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `tags` (text array)
      - `upvotes` (integer)
      - `status` (enum: open, closed, solved)
    
    - `discussion_comments`
      - `id` (uuid, primary key)
      - `discussion_id` (uuid, references discussions)
      - `author_id` (uuid, references profiles)
      - `content` (text)
      - `created_at` (timestamp)
      - `is_solution` (boolean)
      - `upvotes` (integer)

  2. Security
    - Enable RLS on both tables
    - Add policies for CRUD operations
*/

-- Create discussion status enum
CREATE TYPE discussion_status AS ENUM ('open', 'closed', 'solved');

-- Create discussions table
CREATE TABLE IF NOT EXISTS discussions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  author_id uuid REFERENCES profiles(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  tags text[] DEFAULT '{}',
  upvotes integer DEFAULT 0,
  status discussion_status DEFAULT 'open'
);

-- Create discussion comments table
CREATE TABLE IF NOT EXISTS discussion_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id uuid REFERENCES discussions(id) ON DELETE CASCADE NOT NULL,
  author_id uuid REFERENCES profiles(id) NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  is_solution boolean DEFAULT false,
  upvotes integer DEFAULT 0
);

-- Enable RLS
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for discussions
CREATE POLICY "Discussions are viewable by everyone"
  ON discussions
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create discussions"
  ON discussions
  FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their discussions"
  ON discussions
  FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their discussions"
  ON discussions
  FOR DELETE
  USING (auth.uid() = author_id);

-- Create policies for comments
CREATE POLICY "Comments are viewable by everyone"
  ON discussion_comments
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create comments"
  ON discussion_comments
  FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their comments"
  ON discussion_comments
  FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their comments"
  ON discussion_comments
  FOR DELETE
  USING (auth.uid() = author_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS discussions_author_id_idx ON discussions(author_id);
CREATE INDEX IF NOT EXISTS discussions_created_at_idx ON discussions(created_at);
CREATE INDEX IF NOT EXISTS discussions_tags_idx ON discussions USING gin(tags);
CREATE INDEX IF NOT EXISTS discussion_comments_discussion_id_idx ON discussion_comments(discussion_id);
CREATE INDEX IF NOT EXISTS discussion_comments_author_id_idx ON discussion_comments(author_id);

-- Create function to update discussion updated_at
CREATE OR REPLACE FUNCTION update_discussion_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating discussion timestamp
CREATE TRIGGER update_discussion_timestamp
  BEFORE UPDATE ON discussions
  FOR EACH ROW
  EXECUTE FUNCTION update_discussion_timestamp();

-- Create function to handle upvoting
CREATE OR REPLACE FUNCTION handle_upvote(
  table_name text,
  record_id uuid,
  user_id uuid
)
RETURNS void AS $$
BEGIN
  EXECUTE format('
    UPDATE %I
    SET upvotes = upvotes + 1
    WHERE id = $1
    AND NOT EXISTS (
      SELECT 1
      FROM user_upvotes
      WHERE table_name = $2
      AND record_id = $1
      AND user_id = $3
    )',
    table_name
  ) USING record_id, table_name, user_id;
  
  INSERT INTO user_upvotes (table_name, record_id, user_id)
  VALUES (table_name, record_id, user_id)
  ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql;