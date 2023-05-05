export function toNonAccentVietnamese(text: string) {
  return (
    text &&
    text
      .replace(/[AÁÀÃẠÂẤẦẨẪẬĂẮẰẴẶ]/g, 'A')
      .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
      .replace(/[EÉÈẼẸÊẾỀỄỆ]/, 'E')
      .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
      .replace(/[IÍÌĨỊ]/g, 'I')
      .replace(/[ìíịỉĩ]/g, 'i')
      .replace(/[OÓÒÕỌÔỐỒỖỘƠỚỜỠỢ]/g, 'O')
      .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
      .replace(/[UÚÙŨỤƯỨỪỮỰ]/g, 'U')
      .replace(/[ùúụủũưừứựửữ]/g, 'u')
      .replace(/[YÝỲỸỴ]/g, 'Y')
      .replace(/[ỳýỵỷỹ]/g, 'y')
      .replace(/Đ/g, 'D')
      .replace(/đ/g, 'd')
      .replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '')
      .replace(/\u02C6|\u0306|\u031B/g, '')
  );
}
