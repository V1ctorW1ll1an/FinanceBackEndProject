import { ICreateUserInputDTO, ICreateUserOutputDTO } from "./createUserDTO"
import { CreateUserUseCase } from "./createUserUseCase"

describe("CreateUserUseCase", () => {
    it("Should create a user", async () => {
        // input data, execute use case, return output data
        const input: ICreateUserInputDTO = {
            name: "John Doe",
            email: "johndoe@gmail.com",
            password: "123456",
        }

        const expectedOutput: ICreateUserOutputDTO = {
            id: expect.any(String),
            name: "John Doe",
            email: "johndoe@gmail.com",
            password: expect.any(String),
        }

        const userGateway = () => {
            return {
                createUserGateway: jest.fn(),
            }
        }

        const createUserUseCase = new CreateUserUseCase(userGateway())

        const output: ICreateUserOutputDTO = await createUserUseCase.execute(
            input
        )

        expect(output).toMatchObject(expectedOutput)
    })
})
