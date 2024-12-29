import CommitInfo from '@/commit-generator/CommitInfo';

export function buildPrompt({ diff, type }: CommitInfo): string {
  if (type) {
    return `
      Create a commit message in the Conventional Commits format
      Use the commit type '${type}' as the base type.

      As a response, just give the message:
      ${type}: <description>

      Use this diff:
      
      ${diff}`;
  }

  return `
    Create a commit message in the Conventional Commits format:

    As a response, just give the message:
    <type>: <description>

    Use this diff:
    
    ${diff}`;
}
