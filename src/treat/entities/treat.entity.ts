import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Treat {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    treatName: string;

    @Column()
    description: string;
    
    @Column()
    vanue: string;

    @Column({ default: true })
    isActive: boolean;
    
    // @OneToMany(() => Room, (room) => room.roomType)
    // Rooms:Room[];
}
