import { Module } from "@nestjs/common";
import { MongooseModule as Mongoose } from "@nestjs/mongoose";

@Module({
    imports: [Mongoose.forRoot("mongodb://localhost:27017/bank_to_excel")],
})
export class MongooseModule {}
