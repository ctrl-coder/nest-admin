import { LanguageCode } from '@/constants/language';
import { EnumField, StringField } from '@/decorators';

export class CreateTranslationDto {
  @EnumField(() => LanguageCode)
  languageCode!: LanguageCode;

  @StringField()
  text!: string;
}
