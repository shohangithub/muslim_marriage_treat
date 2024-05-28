import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Package } from "./package.entity";

@Entity()

export class PackageGallery {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    imgUrl: string

    @Column({ nullable: true })
    orderNumber: number

    @ManyToOne(() => Package, event => event.galleries)
    package: Package;
}