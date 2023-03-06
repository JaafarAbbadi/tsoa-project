import {
    Body,
    Controller,
    Example,
    Get,
    Path,
    Post,
    Query,
    Route,
    SuccessResponse,
  } from "tsoa";
import { User } from "../../generated/client";
import { PrismaClient } from '../../generated/client'
const prisma = new PrismaClient()
// A post request should not contain an id.
type UserCreationParams = Pick<User, "email" | "name">;

@Route("users")
export class UsersController extends Controller {
  @Example<User>({
    id: 1,
    name: "John Doe",
    email: "hello@tsoa.com"
  })
  /**
   * Retrieves the details of an existing user.
   * Supply the unique user ID from either and receive corresponding user details.
   * @param id The user's identifier
   * @param name Provide a username to display
   */
  @Get("{id}")
  public async getUser(
    @Path() id: number,
    @Query() name?: string
  ): Promise<User> {
    const user = await prisma.user.findUnique({where: {id}})
    if(user) return user;
    else throw new Error("User not found")
  }

  /**
   * Retrieves all users.
   * @param take The number of users to return. Must be >= 0. Default = 10
   * @param skip The number of users to skip. Must be >= 0. Default = 0
   * @remarks This method supports pagination.
   * @example GET /users?take=10&skip=0
   * @exampleResponse
   * [
   * {
   *   "id": 1,
   *  "name": "John Doe",
   * "email": "example@email.com"
   * },
   * {
   *  "id": 2,
   * "name": "Jane Doe",
   * "email": "example@email.com"
   * }
   * ]
   */

  @Get()
  public async getAllUsers(
    @Query() take?: number,
    @Query() skip?: number
  ): Promise<User[]> {
    return await prisma.user.findMany({take, skip})
  }

  @SuccessResponse("201", "Created") // Custom success response
  @Post()
  public async createUser(
    @Body() requestBody: UserCreationParams
  ): Promise<void> {
    this.setStatus(201); // set return status 201
    await prisma.user.create({data: requestBody})
    return;
  }
}