import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { PaginationDto } from "src/shared/dto";
import { Event } from "src/shared/events/entities";
import { EntityManager, Repository } from "typeorm";
import { CreateCoffeeDto } from "./dto/create-coffee.dto";
import { UpdateCoffeeDto } from "./dto/update-coffee.dto";
import { Coffee, Flavor } from './entities';

@Injectable()
export class CoffeeService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
    private readonly entityManager: EntityManager,
  ) { }

  // TODO: add pagination
  async findMany(paginationInput: PaginationDto) {
    return await this.coffeeRepository.find({
      relations: ['flavors'], // populate `coffee.flavors`, it would be empty otherwise
      take: paginationInput.limit,
      skip: paginationInput.offset,
    });
  }

  async findOne(id: number) {
    const coffeeEntity = await this.coffeeRepository.findOne({
      where: { id },
      relations: ['flavors'],
    });
    if (!coffeeEntity) {
      throw new NotFoundException(`Coffee ${id} not found`);
    }
    return coffeeEntity;
  }

  async create(dto: CreateCoffeeDto) {
    const flavors = await Promise.all(
      dto.flavors.map((flavorName) => this.preloadFlavorByName(flavorName)),
    );

    const coffeeEntity = this.coffeeRepository.create({
      ...dto,
      flavors,
    });
    return await this.coffeeRepository.save(coffeeEntity);
  }

  async update(id: number, dto: UpdateCoffeeDto) {
    const flavors = dto.flavors && await Promise.all(
      dto.flavors.map((flavorName) => this.preloadFlavorByName(flavorName)),
    );

    const coffeeEntity = await this.coffeeRepository.preload({
      id,
      ...dto,
      flavors,
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

  async recommendCoffee(id: number) {
    const coffee = await this.coffeeRepository.findOne({ where: { id } });

    await this.entityManager.transaction(async (em) => {
      coffee.recommendations++;

      const event = new Event();
      event.name = 'recomment_coffee';
      event.type = 'coffee';
      event.payload = { coffeeId: coffee.id };

      await em.save(coffee);
      await em.save(event);
    });
  }


  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorRepository.findOne({ where: { name } });
    if (!existingFlavor) {
      return this.flavorRepository.create({ name });
    }
    return existingFlavor;
  }
}
