import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PostModule} from "../src/post/post.module";
import { PostService } from "../src/post/post.service";
import {DatabaseConfig} from "../src/database/database.config";

describe('Posts', () => {
    let app: INestApplication;
    let postService = {
        findPostsByUsername: () => [
            {"username":"Oscar", "post": "Hi people", "created_at": "01.01.01"},
            {"username":"Oscar", "post": "Bye people", "created_at": "02.01.01"}
        ]
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PostModule, DatabaseConfig],
        })
            .overrideProvider(PostService)
            .useValue(postService)
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



    it('/GET findPostsByUsername Unauthorized', () => {
        return request(app.getHttpServer())
            .get('/post/Oscar')
            .set('Authorization', 'Bearer TYTtyhabssg26732hqghqg')
            .expect(200)
            .expect(
                postService.findPostsByUsername()
            );
    });

    afterAll(async () => {
        await app.close();
    });

});