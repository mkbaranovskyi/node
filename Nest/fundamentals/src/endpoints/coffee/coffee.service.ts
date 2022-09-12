import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateCoffeeDto } from "./dto/create-coffee.dto";
import { UpdateCoffeeDto } from "./dto/update-coffee.dto";
import { CoffeeEntity } from './entities';

@Injectable()
export class CoffeeService {
  constructor(
    @InjectRepository(CoffeeEntity)
    private readonly coffeeRepository: Repository<CoffeeEntity>,
  ) { }

  // TODO: add pagination
  async findMany(paginationInput) {
    return await this.coffeeRepository.find();
  }

  async findOne(id: number) {
    const coffeeEntity = await this.coffeeRepository.findOne({ where: { id } });
    if (!coffeeEntity) {
      throw new NotFoundException(`Coffee ${id} not found`);
    }
    return coffeeEntity;
  }

  async create(dto: CreateCoffeeDto) {
    const coffeeEntity = this.coffeeRepository.create(dto);
    return await this.coffeeRepository.save(coffeeEntity);
  }

  async update(id: number, dto: UpdateCoffeeDto) {
    const coffeeEntity = await this.coffeeRepository.preload({
      id,
      ...dto,
    });
    if (!coffeeEntity) {
      throw new NotFoundException(`Coffee ${id} not found`);
    }
    return await this.coffeeRepository.save(coffeeEntity);
  }

  async remove(id: number) {
    const result = await this.coffeeRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Coffee ${id} not found`);
    }
    return result;
  }
}
