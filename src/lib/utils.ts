import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import * as aes256 from "aes256"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const encrypt = (text: string, key: string): string => {
  // eslint-disable-next-line
  // @ts-ignore
  // eslint-disable-next-line
  return aes256.encrypt(key, text)
}

export const decrypt = async (encryptedText: string, key: string): Promise<string> => {
  // eslint-disable-next-line
  // @ts-ignore
  // eslint-disable-next-line
  return aes256.decrypt(key, encryptedText)
}

export const displayEmail = (email: string): string => {
  return email.replace(/(.{2})(.*)(@.*)/, "$1...$3")
}
