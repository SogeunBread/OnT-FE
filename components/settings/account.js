export function validateAccount(value, today = new Date()) {
  if (!value.name.trim()) return "이름을 입력해주세요.";
  const digits = value.birthDate.replace(/\D/g, "");
  const year = Number(digits.slice(0, 4));
  const month = Number(digits.slice(4, 6));
  const day = Number(digits.slice(6, 8));
  const date = new Date(year, month - 1, day);
  if (digits.length !== 8 || date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day || date > today) return "올바른 생년월일을 입력해주세요.";
  if (!/^[\d\s-]+$/.test(value.phone) || !/^\d{10,11}$/.test(value.phone.replace(/\D/g, ""))) return "올바른 연락처를 입력해주세요.";
  if (!["male", "female"].includes(value.gender)) return "성별을 선택해주세요.";
  return "";
}

export function normalizeAccount(value) {
  const digits = value.birthDate.replace(/\D/g, "");
  return { ...value, name: value.name.trim(), birthDate: `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`, phone: value.phone.trim() };
}

export function releaseAccountPhoto(source) {
  const uri = typeof source === "string" ? source : source?.uri;
  if (uri?.startsWith("blob:") && typeof URL !== "undefined") URL.revokeObjectURL?.(uri);
}
