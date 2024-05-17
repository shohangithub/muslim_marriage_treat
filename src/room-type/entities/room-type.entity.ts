import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class RoomType {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    typeName: string;

    @Column()
    description: string;
    
    @Column({ default: true })
    isActive: boolean;
    
    // @OneToMany(() => Room, (room) => room.roomType)
    // rooms!:Room[];
}
