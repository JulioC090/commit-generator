import Prompt from '@/Prompt';
import PromptBuilder from '@/PromptBuilder';

const sections = ['Intro', 'Rules', 'Output', 'Examples', 'Input'];

export default class PromptTemplateParser {
  constructor(private promptBuilder: PromptBuilder = new PromptBuilder()) {}

  parse(
    template: string,
    variables: { [key: string]: string | undefined },
  ): Prompt {
    let previousSection: string;
    let currentSection: string = 'Intro';
    let currentSectionContent: string = '';
    let isOptional: boolean;

    const templateContent = template.trim();

    for (const line of templateContent.split('\n')) {
      const sectionMatches = [...line.matchAll(/\[([^\]]+)\]/g)].map(
        (match) => match[1],
      );

      if (sectionMatches.length > 0) {
        isOptional = false;
        previousSection = currentSection;
        currentSection = '';

        sectionMatches.forEach((value) => {
          if (value === 'Optional') {
            isOptional = true;
            return;
          }

          if (sections.includes(value)) {
            currentSection = value;
            return;
          }
        });

        if (!currentSection) throw new Error('Invalid Section');

        if (previousSection === currentSection) continue;

        switch (previousSection) {
          case 'Intro':
            this.promptBuilder.addIntro(currentSectionContent);
            break;
          case 'Rules':
            this.promptBuilder.addRules(currentSectionContent);
            break;
          case 'Output':
            this.promptBuilder.addOutput(currentSectionContent);
            break;
          case 'Examples':
            this.promptBuilder.addExamples(currentSectionContent);
            break;
        }

        currentSectionContent = '';
        continue;
      }

      const variablesMatch = [...line.matchAll(/\{([^}]+)\}/g)].map(
        (match) => match[1],
      );

      if (variablesMatch.length > 0) {
        const parsedVariables: { [key: string]: string } = {};

        variablesMatch.forEach((variableName) => {
          const variableValue = variables[variableName] || '';

          if (!variableValue && !isOptional)
            throw new Error(`${variableName} is not defined`);

          parsedVariables[variableName] = variableValue;
        });

        const result = Object.entries(parsedVariables).reduce(
          (result, [key, value]) =>
            result.replace(new RegExp(`\\{${key}\\}`, 'g'), value),
          line,
        );

        currentSectionContent += result;
      } else {
        currentSectionContent += line;
      }

      if (currentSection === 'Input' && currentSectionContent.trim()) {
        this.promptBuilder.addInput(currentSectionContent);
        currentSectionContent = '';
        continue;
      }

      if (line.trim()) {
        currentSectionContent += '\n';
      }
    }

    return this.promptBuilder.build();
  }
}
