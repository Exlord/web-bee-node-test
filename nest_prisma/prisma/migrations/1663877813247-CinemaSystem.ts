import { Migration } from '../cli/migration';
import { PrismaService } from '../../src/prisma/prisma.service';

const prisma = new PrismaService();

export default class implements Migration {
  async up() {
    /**
     # ToDo: Create a migration that creates all tables for the following user stories

     For an example on how a UI for an api using this might look like, please try to book a show at https://in.bookmyshow.com/.
     To not introduce additional complexity, please consider only one cinema.

     Please list the tables that you would create including keys, foreign keys and attributes that are required by the user stories.

     ## User Stories

     **Movie exploration**
     * As a user I want to see which films can be watched and at what times
     * As a user I want to only see the shows which are not booked out

     **Show administration**
     * As a cinema owner I want to run different films at different times
     * As a cinema owner I want to run multiple films at the same time in different showrooms

     **Pricing**
     * As a cinema owner I want to get paid differently per show
     * As a cinema owner I want to give different seat types a percentage premium, for example 50 % more for vip seat

     **Seating**
     * As a user I want to book a seat
     * As a user I want to book a vip seat/couple seat/super vip/whatever
     * As a user I want to see which seats are still available
     * As a user I want to know where I'm sitting on my ticket
     * As a cinema owner I dont want to configure the seating for every show
     */

    try {
      await prisma.$queryRaw`CREATE TABLE "ShowRoom" (
                                                         "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                                                         "name" TEXT NOT NULL
                             );`;
      await prisma.$queryRaw`CREATE TABLE "movies" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "ticketPrice" INTEGER NOT NULL
);`;
      await prisma.$queryRaw`CREATE TABLE "MovieTime" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "start" DATETIME NOT NULL,
    "movieId" INTEGER NOT NULL,
    "showRoomId" INTEGER NOT NULL,
    CONSTRAINT "MovieTime_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "movies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MovieTime_showRoomId_fkey" FOREIGN KEY ("showRoomId") REFERENCES "ShowRoom" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);`;
      await prisma.$queryRaw`CREATE TABLE "CinemaSeat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "seatTypeId" INTEGER NOT NULL,
    "showRoomId" INTEGER NOT NULL,
    "locationX" INTEGER NOT NULL,
    "locationY" INTEGER NOT NULL,
    CONSTRAINT "CinemaSeat_seatTypeId_fkey" FOREIGN KEY ("seatTypeId") REFERENCES "CinemaSeatType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CinemaSeat_showRoomId_fkey" FOREIGN KEY ("showRoomId") REFERENCES "ShowRoom" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);`;
      await prisma.$queryRaw`CREATE TABLE "CinemaSeatType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "premiumPercentage" INTEGER NOT NULL
);`;
      await prisma.$queryRaw`CREATE TABLE "BookedSeat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "seatId" INTEGER NOT NULL,
    "timeId" INTEGER NOT NULL,
    CONSTRAINT "BookedSeat_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "CinemaSeat" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BookedSeat_timeId_fkey" FOREIGN KEY ("timeId") REFERENCES "MovieTime" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);`;

      // automatic rollback on error
    } catch (e) {
      console.error(e);
    } finally {
      await prisma.$disconnect();
    }
  }

  async down() {
    await prisma.$queryRaw`DROP TABLE "ShowRoom"`;
    await prisma.$queryRaw`DROP TABLE "movies"`;
    await prisma.$queryRaw`DROP TABLE "MovieTime"`;
    await prisma.$queryRaw`DROP TABLE "CinemaSeat"`;
    await prisma.$queryRaw`DROP TABLE "CinemaSeatType"`;
    await prisma.$queryRaw`DROP TABLE "BookedSeat"`;
  }
}
