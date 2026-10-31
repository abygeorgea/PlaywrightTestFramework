function readRequired(key: 'url' | 'emailAddress' | 'password'): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable '${key}'. Copy .env.example to .env and set a value for it.`);
  }
  return value;
}

export const config = {
  get url(): string {
    return readRequired('url');
  },
  get emailAddress(): string {
    return readRequired('emailAddress');
  },
  get password(): string {
    return readRequired('password');
  },
};
