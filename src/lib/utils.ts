import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import * as aes256 from "aes256"
import * as bcrypt from "bcryptjs"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const encrypt = (text: string, key: string): string => {
  // eslint-disable-next-line
  // @ts-ignore
  // eslint-disable-next-line
  return aes256.encrypt(key, text)
}

export const decrypt = (encryptedText: string, key: string): string => {
  // eslint-disable-next-line
  // @ts-ignore
  // eslint-disable-next-line
  return aes256.decrypt(key, encryptedText)
}

export const hash = async (text: string): Promise<string> => {
  const salt = await bcrypt.genSalt(12)
  const hash = await bcrypt.hash(text, salt)

  return hash;
}
