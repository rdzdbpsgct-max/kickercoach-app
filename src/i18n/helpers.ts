import i18n from "./index";

export function tConstant(prefix: string, key: string): string {
  return i18n.t(`constants.${prefix}.${key}`);
}
