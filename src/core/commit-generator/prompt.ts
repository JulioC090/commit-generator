import ICommitInfo from '@/core/types/ICommitInfo';

export function buildPrompt({ diff, type }: ICommitInfo): string {
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
