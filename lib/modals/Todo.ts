import { Collection, ObjectId } from 'mongodb';
import clientPromise from '../mongodb';
import { Todo, CreateTodoInput, UpdateTodoInput } from '@/types/todo';

export class TodoModel {
  private static async getCollection(): Promise<Collection> {
    const client = await clientPromise;
    const db = client.db('todoapp');
    return db.collection('todos');
  }

  static async findAll(): Promise<Todo[]> {
    const collection = await this.getCollection();
    const todos = await collection.find({}).sort({ createdAt: -1 }).toArray();
    
    return todos.map(todo => ({
      _id: todo._id.toString(),
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
    }));
  }

  static async findById(id: string): Promise<Todo | null> {
    const collection = await this.getCollection();
    const todo = await collection.findOne({ _id: new ObjectId(id) });
    
    if (!todo) return null;

    return {
      _id: todo._id.toString(),
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
    };
  }

  static async create(input: CreateTodoInput): Promise<Todo> {
    const collection = await this.getCollection();
    const now = new Date();
    
    const result = await collection.insertOne({
      ...input,
      completed: false,
      createdAt: now,
      updatedAt: now,
    });

    const todo = await collection.findOne({ _id: result.insertedId });
    
    return {
      _id: todo!._id.toString(),
      title: todo!.title,
      description: todo!.description,
      completed: todo!.completed,
      createdAt: todo!.createdAt,
      updatedAt: todo!.updatedAt,
    };
  }

  static async update(id: string, input: UpdateTodoInput): Promise<Todo | null> {
    const collection = await this.getCollection();
    
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          ...input,
          updatedAt: new Date() 
        } 
      },
      { returnDocument: 'after' }
    );

    if (!result) return null;

    return {
      _id: result._id.toString(),
      title: result.title,
      description: result.description,
      completed: result.completed,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  static async delete(id: string): Promise<boolean> {
    const collection = await this.getCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }
}