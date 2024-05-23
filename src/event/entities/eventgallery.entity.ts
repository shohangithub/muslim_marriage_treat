import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Event } from "./event.entity";

@Entity()

export class EventGallery{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    imgUrl: string
    @ManyToOne(() => Event, event => event.galleries)
    event: Event;
}