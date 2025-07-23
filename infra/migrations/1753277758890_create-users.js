/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    // for reference, GitHub limits username up to 39 characters
    username: {
      type: "varchar(30)",
      notNull: true,
      unique: true,
    },
    // 254 characters = is the limit considering email specification
    email: {
      type: "varchar(254)",
      notNull: true,
      unique: true,
    },
    // 60 character = bcrypt maximum length (https://www.npmjs.com/package/bcrypt#hash-info)
    password: {
      type: "varchar(60)",
      notNull: true,
    },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
  });
};

exports.down = false;
