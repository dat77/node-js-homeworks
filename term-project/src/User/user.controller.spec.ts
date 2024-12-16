import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { DatabaseConfig } from "../database/database.config";

describe('UsersController', () => {
    let userController: UserController;
    let userService: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [UserService],
            imports: [DatabaseConfig],
        }).compile();
        userController = module.get(UserController);
        userService = module.get(UserService);
    });

    it('should be defined', () => {
        expect(userController).toBeDefined();
    });

    it('should be defined', () => {
        expect(userService).toBeDefined();
    });

    describe('findUser', () => {
        it('should return user', async () => {
            const result = {"id": "1","username": "Oscar", "password": "quieyqiu28379283qehkqhk=", "email":"oscar.wilde@domain.com"};
            jest.spyOn( userService, 'findUserByUsername').mockImplementation(() => Promise.resolve(result));
            expect( await userController.findUser('Oscar') ).toBe(result);
        })

    })

})