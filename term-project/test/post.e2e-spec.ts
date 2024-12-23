import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PostModule} from "../src/post/post.module";
import { PostService } from "../src/post/post.service";
import {DatabaseConfig} from "../src/database/database.config";
import { AuthGuard } from "../src/auth/auth.guard";

describe('Posts', () => {
    let app: INestApplication;
    let postService = {
        findPostsByUsername: (username: string) => [
            {"username":username, "post": "Hi people", "created_at": "01.01.01"},
            {"username":username, "post": "Bye people", "created_at": "02.01.01"}
        ]
    };
    let authGuard = {
        validateTokens: (token: string, request: any) => token === 'ok'
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PostModule, DatabaseConfig],
        })
            .overrideProvider(PostService)
            .useValue(postService)
            .overrideGuard(AuthGuard)
            .useValue(authGuard)
            .compile();

        app = module.createNestApplication();
        await app.init();
    });

    it('/GET findPostsByUsername Forbidden', () => {
        return request(app.getHttpServer())
            .get('/post/Oscar')
            .expect(403)
            .expect({
                "message": "Token is missing", "error": 'Forbidden', "statusCode": 403
            });
    });

    it('/GET findPostsByUsername Unauthorized', () => {
        return request(app.getHttpServer())
            .get('/post/Oscar')
            .set('Authorization', 'Bearer any')
            .expect(401)
            .expect({
                "message": "Invalid or expired access token", "error": 'Unauthorized', "statusCode": 401
            });
    });

    it('/GET findPostsByUsername OK', () => {
        return request(app.getHttpServer())
            .get('/post/Oscar')
            .set('Authorization', 'Bearer ok')
            .expect(200)
            .expect(
                postService.findPostsByUsername('Oscar')
            );
    });

    afterAll(async () => {
        await app.close();
    });

});