import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import { Logger, NotFoundException } from '@nestjs/common';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;
  constructor(private readonly model: Model<TDocument>) {}

  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const created = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await created.save()).toJSON() as unknown as TDocument;
  }

  async find(filterQuery: FilterQuery<TDocument>) {
    return this.model.find(filterQuery, {}, { lean: true });
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ) {
    const document = await this.model.findOneAndUpdate(filterQuery, update, {
      new: true,
    });
    if (!document) {
      this.logger.warn(`Document not found: ${JSON.stringify(filterQuery)}`);
      throw new NotFoundException('Document not found');
    }
    return document;
  }
  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model.findOne(filterQuery, {}, { lean: true });
    if (!document) {
      this.logger.warn(`Document not found: ${JSON.stringify(filterQuery)}`);
      throw new NotFoundException('Document not found');
    }
    return document as TDocument;
  }

  async findOneAndDelete(filterQuery: FilterQuery<TDocument>) {
    return this.model.findOneAndDelete(filterQuery, { lean: true });
  }
}
