import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class createLocationTable1744986750897 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'locations',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            default: "'active'",
          },
          {
            name: 'organization_id',
            type: 'integer',
            isNullable: false,
          },
        ],
      }),
      true,
    );
    ``;
    await queryRunner.createForeignKey(
      'locations',
      new TableForeignKey({
        columnNames: ['organization_id'],
        referencedTableName: 'organization',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // Seed dữ liệu mẫu
    await queryRunner.query(`
          INSERT INTO locations (id, name, organization_id, status) VALUES
            (1, 'Da Nang', 1, 'actived'),
            (2, 'Ha Noi', 1, 'unactive'),
            (3, 'Ho Chi Minh', 1, 'actived'),
            (4, 'Nha Trang', 2, 'actived'),
            (5, 'Can Tho', 2, 'actived');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('locations');
  }
}
