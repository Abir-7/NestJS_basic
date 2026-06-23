export function generateCode(
  length = 6,
  type: 'digit' | 'mixed' = 'digit',
): string {
  const digits = '0123456789';
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  const chars = type === 'mixed' ? digits + letters : digits;

  let code = '';

  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  return code;
}
