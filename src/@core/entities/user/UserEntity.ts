import crypto from "crypto"

export class Email {
    private _email: string

    public get value(): string {
        return this._email
    }

    private constructor(email: string) {
        this._email = email
    }

    public static create(email: string): Email {
        // validate email
        if (!email) throw new Error("Email is required")
        if (email.length > 255) throw new Error("Email is too long")
        if (email.length < 3) throw new Error("Email is too short")
        // regex validation email
        const regex =
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (!regex.test(email)) throw new Error("Email is invalid")
        const emailObj = new Email(email)
        return emailObj
    }
}

export interface IPasswordProps {
    password: string
    salt?: string
}

export class Password {
    private _password: string
    private _salt: string

    public get value(): string {
        return this._password
    }

    private constructor(props: IPasswordProps) {
        this._salt = props.salt
            ? props.salt
            : crypto.randomBytes(16).toString("hex")
        this._password = this.encryptPassword(props.password)
    }

    public static create(passwordProps: IPasswordProps): Password {
        // validate password
        if (!passwordProps.password) throw new Error("Password is required")
        if (passwordProps.password.length > 255)
            throw new Error("Password is too long")
        if (passwordProps.password.length < 3)
            throw new Error("Password is too short")
        const passwordObj = new Password(passwordProps)
        return passwordObj
    }

    private encryptPassword(password: string): string {
        const hashedPassword = crypto
            .pbkdf2Sync(password, this._salt, 1000, 64, `sha512`)
            .toString(`hex`)

        return hashedPassword
    }

    public comparePassword(password: string): boolean {
        const hash = crypto
            .pbkdf2Sync(password, this._salt, 1000, 64, `sha512`)
            .toString(`hex`)
        return this._password === hash
    }
}

export interface IUserEntityProps {
    id?: string
    name: string
    email: Email
    password: Password
}

export class UserEntity {
    private readonly _id: string
    private _name: string
    private _email: Email
    private _password: Password

    public get id(): string {
        return this._id
    }

    public get name(): string {
        return this._name
    }

    public get email(): Email {
        return this._email
    }

    public get password(): Password {
        return this._password
    }

    private constructor(props: IUserEntityProps) {
        this._id = props.id ? props.id : crypto.randomUUID()
        this._name = props.name
        this._email = props.email
        this._password = props.password
    }

    public static create(userProps: IUserEntityProps): UserEntity {
        // validate props

        if (!userProps.name) throw new Error("Name is required")

        // create user
        const userEntity = new UserEntity(userProps)
        return userEntity
    }
}
