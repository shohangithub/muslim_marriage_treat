import { Event } from "src/event/entities/event.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Instructor {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;

    @Column()
    degree!: string;
  
    @Column()
    imageUrl!: string;
  
    @Column({ default: true })
    isActive: boolean;

    @Column({ nullable: true })
    orderNumber: number

    @ManyToMany(() => Event, (event) => event.instructors)
    events!: Event[]
}
