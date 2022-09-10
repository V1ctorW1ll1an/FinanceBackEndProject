// test user entity

import { UserEntity, IUserEntityProps, Email, Password } from "./UserEntity"

describe("UserEntity", () => {
    it("should throw error without email", () => {
        expect(() => Email.create("")).toThrowError("Email is required")
    })

    it("should throw error without password", () => {
        expect(() => Password.create({ password: "", salt: "" })).toThrowError(
            "Password is required"
        )
    })

    it("should throw error with invalid email length", () => {
        expect(() => Email.create("a".repeat(256))).toThrowError(
            "Email is too long"
        )

        expect(() => Email.create("a".repeat(2))).toThrowError(
            "Email is too short"
        )
    })

    it("should throw error with password password length", () => {
        expect(() =>
            Password.create({ password: "a".repeat(256), salt: "" })
        ).toThrowError("Password is too long")

        expect(() =>
            Password.create({ password: "a".repeat(2), salt: "" })
        ).toThrowError("Password is too short")
    })

    it("should throw error with invalid email", () => {
        expect(() => Email.create("invalid")).toThrowError("Email is invalid")

        expect(() => Email.create("invalid@")).toThrowError("Email is invalid")

        expect(() => Email.create("invalid@invalid")).toThrowError(
            "Email is invalid"
        )

        expect(() => Email.create("invalid@invalid.")).toThrowError(
            "Email is invalid"
        )
    })

    it("should not create a user without name", () => {
        const userProps: IUserEntityProps = {
            id: "id",
            name: "",
            email: Email.create("jonhdoe@gmail.com"),
            password: Password.create({ password: "12345", salt: "" }),
        }

        expect(() => UserEntity.create(userProps)).toThrowError(
            "Name is required"
        )
    })

    it("should create a user", () => {
        const userProps: IUserEntityProps = {
            id: "8432742374823",
            name: "john doe",
            email: Email.create("jonhdoe@gmail.com"),
            password: Password.create({ password: "12345", salt: "" }),
        }

        const user = UserEntity.create(userProps)

        expect(user.id).toBe("8432742374823")
        expect(user.name).toBe("john doe")
        expect(user.email.value).toBe("jonhdoe@gmail.com")
        expect(user.password.value).not.toBe("12345")
    })

    it("Should create user and crypto password", () => {
        const userProps: IUserEntityProps = {
            id: "8432742374823",
            name: "john doe",
            email: Email.create("johndoe@gmail.com"),
            password: Password.create({ password: "12345", salt: "" }),
        }

        const user = UserEntity.create(userProps)

        expect(user.password.value).not.toBe("12345")
    })

    it("Should compare password", () => {
        const userProps: IUserEntityProps = {
            id: "8432742374823",
            name: "john doe",
            email: Email.create("johndoe@gmail.com"),
            password: Password.create({ password: "12345", salt: "" }),
        }

        const user = UserEntity.create(userProps)

        expect(user.password.comparePassword("12345")).toBe(true)

        expect(user.password.comparePassword("123456")).toBe(false)
    })

    it("Should return true with salt", () => {
        const userProps: IUserEntityProps = {
            id: "8432742374823",
            name: "john doe",
            email: Email.create("johndoe@gmail.com"),
            password: Password.create({
                password: "12345",
                salt: "4666d4544c08bcbd6306ef4b842b1b3f",
            }),
        }

        const user = UserEntity.create(userProps)

        expect(user.password.comparePassword("12345")).toBe(true)
    })

    it("Should create an id when it was not informed", () => {
        const userProps: IUserEntityProps = {
            id: "",
            name: "john doe",
            email: Email.create("johndoe@gmail.com"),
            password: Password.create({ password: "12345", salt: "" }),
        }

        const user = UserEntity.create(userProps)

        expect(user.id).not.toBe("")
    })
})
