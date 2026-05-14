const getShortName = (name: string | null | undefined) => {
    if (!name) return "U"
    if (name.length == 1) return name

    const splitName = name.split(" ")

    if (splitName.length === 1) return splitName[0].split("")[0] + splitName[0].split("")[splitName[0].split("").length - 1]

    const firstWord = splitName[0]
    const lastWord = splitName[splitName.length - 1]

    return firstWord.split("")[0].toUpperCase() + lastWord.split("")[0].toUpperCase()
}

export default getShortName