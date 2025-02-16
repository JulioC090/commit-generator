export default interface ISchemeValidator {
  validate(values: unknown, scheme: unknown): boolean;
}
