-- AlterTable
CREATE SEQUENCE answer_id_seq;
ALTER TABLE "Answer" ALTER COLUMN "id" SET DEFAULT nextval('answer_id_seq');
ALTER SEQUENCE answer_id_seq OWNED BY "Answer"."id";
