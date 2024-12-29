import CommitInfo from '@/commit-generator/CommitInfo';

export function buildPrompt({ diff }: CommitInfo): string {
  return `
    Create a commit message in the Conventional Commits format for this diff:
    
    ${diff}
    
    As a response, just give the message:
    <type>: <description>`;
}
