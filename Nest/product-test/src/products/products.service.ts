import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { Product, ProductDocument } from './database/schemas/product.schema'
import { Model } from 'mongoose';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

  async getAll(): Promise<Product[]> {
    return this.productModel.find().exec()
  }

  async getById(id: number): Promise<Product> {
    return this.productModel.findById(id)
  }

  async create(productDto: CreateProductDto): Promise<Product> {
    return this.productModel.create(productDto)
  }

  async remove(id: number): Promise<Product> {
    return this.productModel.findByIdAndRemove(id)
  }

  async update(id: number, productDto: UpdateProductDto): Promise<Product> {
    return this.productModel.findByIdAndUpdate(id, productDto)
  }
}
