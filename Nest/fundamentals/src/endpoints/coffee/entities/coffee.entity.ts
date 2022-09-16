import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Flavor } from "./flavor.entity";

@Entity()
export class Coffee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  brand: string;

  @Column({ default: 0 })
  recommendations: number;

  @JoinTable() // difines the owner
  @ManyToMany(
    type => Flavor,
    (flavor) => flavor.coffees,
    { cascade: true }, // new `Flavors` will be added to the DB along with new created `coffee`
  )
  flavors: Flavor[];
}
