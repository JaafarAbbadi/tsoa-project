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
import { PrismaClient, Post as Article  } from '../../generated/client'
const prisma = new PrismaClient()
// A post request should not contain an id.
type ArticleCreationParams = Pick<Article, "authorId"| "content" | "title">;
@Route("posts")
export class PostsController extends Controller {
    /**
     * Retrieves all posts.
     * @param take The number of posts to return. Must be >= 0. Default = 10
     * @param skip The number of posts to skip. Must be >= 0. Default = 0
     * @remarks This method supports pagination.
     * @example GET /posts?take=10&skip=0
     * @exampleResponse
     * [
     *  {
     *      "id": 1,
     *      "title": "Post 1",
     *      "content": "Post 1 content",
     *      "authorId": 1
     *  },
     *  {
     *      "id": 2,
     *      "title": "Post 2",
     *      "content": "Post 2 content",
     *      "authorId": 1
     *  }
     * ]
     */
    @Get()
    public async getAllPosts(
        @Query() take?: number,
        @Query() skip?: number
    ): Promise<Article[]> {
        return await prisma.post.findMany({take, skip})
    }
    /**
    * Retrieves the details of an existing post.
    * Supply the unique post ID from either and receive corresponding post details.
    * @param id The post's identifier
    */
    @Get("{id}")
    public async getPost(
        @Path() id: number,
    ): Promise<Article> {
        const post = await prisma.post.findUnique({where: {id}})
        if(post) return post;
        else throw new Error("Post not found")
    }
    @Get("author/{authorId}")
    public async getPostsByAuthor(
        @Path() authorId: number,
    ): Promise<Article[]> {
        const posts = await prisma.post.findMany({where: {authorId}})
        
        if(posts) return posts;
        else throw new Error("Post not found")
    }
    /**
     * Creates a new post.
    */
    @Example<ArticleCreationParams>({
        authorId: 1,
        title: "Post 1",
        content: "Post 1 content"
    })
    @SuccessResponse("201", "Created") // Custom success response
    @Post()
    public async createPost(
        @Body() requestBody: ArticleCreationParams
    ): Promise<void> {
        this.setStatus(201); // set return status 201
        await prisma.post.create({data: requestBody})
        return;
    }
}