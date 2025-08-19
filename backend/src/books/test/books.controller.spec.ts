import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from '../books.controller';
import { BooksService } from '../books.service';
import { CreateBookDto } from '../create-book.dto'; // Add this import


describe('BooksController', () => {
    let controller: BooksController;
    let booksService: Partial<Record<keyof BooksService, jest.Mock>>;

    beforeEach(async () => {
        booksService = {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [BooksController],
            providers: [
                { provide: BooksService, useValue: booksService },
            ],
        }).compile();

        controller = module.get<BooksController>(BooksController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findAll', () => {
        it('should return all books', async () => {
            const result = [{ id: 1, title: 'Book', author: 'Author', genre: 'Fiction', status: 'available' }];
            booksService.findAll!.mockReturnValue(result);
            expect(controller.findAll()).toBe(result);
        });
    });

    describe('findOne', () => {
        it('should return a book by id', async () => {
            const result = { id: 1, title: 'Book', author: 'Author', genre: 'Fiction', status: 'available' };
            booksService.findOne!.mockReturnValue(result);
            expect(controller.findOne('1')).toBe(result);
            expect(booksService.findOne).toHaveBeenCalledWith(1);
        });
    });

    describe('create', () => {
        it('should create a book', async () => {
            const body: CreateBookDto = { title: 'Book', author: 'Author', genre: 'Fiction', status: 'available' };
            booksService.create!.mockReturnValue(body);
            expect(controller.create(body)).toBe(body);
            expect(booksService.create).toHaveBeenCalledWith(body);
        });

        it('should throw error if required fields are missing', () => {
            expect(() => controller.create({title: '', author: '', genre: '', status: undefined as any}))
                .toThrow('Missing required fields: title, author, genre, status');
        });
    });

    describe('update', () => {
        it('should update a book', async () => {
            const body = { title: 'Updated' };
            booksService.update!.mockReturnValue({ id: 1, ...body });
            expect(controller.update('1', body)).toEqual({ id: 1, ...body });
            expect(booksService.update).toHaveBeenCalledWith(1, body);
        });

        it('should throw error if no fields provided', () => {
            expect(() => controller.update('1', {} as any))
                .toThrow('At least one field must be provided for update');
        });
    });

    describe('remove', () => {
        it('should remove a book', async () => {
            booksService.remove!.mockReturnValue({ deleted: true });
            expect(controller.remove('1')).toEqual({ deleted: true });
            expect(booksService.remove).toHaveBeenCalledWith(1);
        });
    });
});