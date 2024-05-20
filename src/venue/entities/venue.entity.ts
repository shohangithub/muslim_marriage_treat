import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Venue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  venueName: string;

  @Column()
  venueAdress!: string;

  @Column({ default: true })
  isActive: boolean;
}
