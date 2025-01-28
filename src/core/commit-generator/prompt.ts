import ICommitInfo from '@/core/types/ICommitInfo';

export function buildPrompt({ diff, type, previousLogs }: ICommitInfo): string {
  return `
    Create a commit message in the Conventional Commits format
    ${type ? `Use the commit type '${type}' as the base type.` : ''} 

    As a response, just give the message:
    ${type ? `${type}: <description>` : '<type>: description'}

    ${previousLogs ? `Use this as a base: \n${previousLogs}` : ''}

    Use this diff:
      
    ${diff}
  `.trim();
}
