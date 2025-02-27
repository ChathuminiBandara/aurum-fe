export function cn(...inputs) {
  let className = ""
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i]
    if (input) {
      if (typeof input === "string") {
        className += input + " "
      } else if (typeof input === "number") {
        className += input.toString() + " "
      } else if (Array.isArray(input)) {
        className += cn(...input) + " "
      } else if (typeof input === "object") {
        for (const key in input) {
          if (input.hasOwnProperty(key) && input[key]) {
            className += key + " "
          }
        }
      }
    }
  }
  return className.trim()
}

