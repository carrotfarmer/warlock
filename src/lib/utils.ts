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

export const decrypt = (encryptedText: string, key: string): string => {
  // eslint-disable-next-line
  // @ts-ignore
  // eslint-disable-next-line
  return aes256.decrypt(key, encryptedText)
}

export const displayEmail = (email: string): string => {
  return email.replace(/(.{2})(.*)(@.*)/, "$1...$3")
}

export const genPassword = (length: number): string => {
  // uppercase, lowercase, number, symbol
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const lowercase = "abcdefghijklmnopqrstuvwxyz"
  const numbers = "0123456789"
  const symbols = "!@#$%&*()+="

  // uppercase % = 10
  // lowercase % = 50
  // numbers % = 20
  // symbols % = 20

  const upper = Math.floor((length * 10) / 100)
  const lower = Math.floor((length * 50) / 100)
  const number = Math.floor((length * 20) / 100)
  const symbol = Math.floor((length * 20) / 100)

  let password = ""

  for (let i = 0; i < upper; i++) {
    password += uppercase.charAt(Math.floor(Math.random() * uppercase.length))
  }

  for (let i = 0; i < lower; i++) {
    password += lowercase.charAt(Math.floor(Math.random() * lowercase.length))
  }

  for (let i = 0; i < number; i++) {
    password += numbers.charAt(Math.floor(Math.random() * numbers.length))
  }

  for (let i = 0; i < symbol; i++) {
    password += symbols.charAt(Math.floor(Math.random() * symbols.length))
  }

  return password
}
