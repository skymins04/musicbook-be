import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1679207742841 implements MigrationInterface {
    name = 'Migration1679207742841'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_twitch\` CHANGE \`twitch_display_name\` \`twitch_display_name\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_twitch\` CHANGE \`twitch_description\` \`twitch_description\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_twitch\` CHANGE \`twitch_offline_img_url\` \`twitch_offline_img_url\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_twitch\` CHANGE \`twitch_created_at\` \`twitch_created_at\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`user_twitch\` CHANGE \`twitch_type\` \`twitch_type\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_twitch\` CHANGE \`twitch_broadcaster_type\` \`twitch_broadcaster_type\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_twitch\` CHANGE \`twitch_refresh_token\` \`twitch_refresh_token\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_twitch\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_google\` CHANGE \`google_display_name\` \`google_display_name\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_google\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`music-like\` DROP FOREIGN KEY \`FK_f1ece8f29683e09cf82479abb7f\``);
        await queryRunner.query(`ALTER TABLE \`music-like\` DROP FOREIGN KEY \`FK_2619efd7dcd1109b43d93b5058c\``);
        await queryRunner.query(`ALTER TABLE \`music-like\` DROP FOREIGN KEY \`FK_18f2eda6a92af0549a21cec9289\``);
        await queryRunner.query(`ALTER TABLE \`music-like\` CHANGE \`viewer_id\` \`viewer_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`music-like\` CHANGE \`bk_id\` \`bk_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`music-like\` CHANGE \`msc_id\` \`msc_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`book-like\` DROP FOREIGN KEY \`FK_e836e970feb6902a8d30f7aa61e\``);
        await queryRunner.query(`ALTER TABLE \`book-like\` DROP FOREIGN KEY \`FK_141db9d7c6a7d9e4de23d850443\``);
        await queryRunner.query(`ALTER TABLE \`book-like\` CHANGE \`viewer_id\` \`viewer_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`book-like\` CHANGE \`bk_id\` \`bk_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`music-like-count\` DROP FOREIGN KEY \`FK_355683d297acfd74647f5399cfc\``);
        await queryRunner.query(`ALTER TABLE \`music-like-count\` DROP FOREIGN KEY \`FK_8b9502b5c1af22d8068a4626c01\``);
        await queryRunner.query(`ALTER TABLE \`music-like-count\` DROP FOREIGN KEY \`FK_cf68ebad60469303b7b50f71563\``);
        await queryRunner.query(`ALTER TABLE \`music-like-count\` CHANGE \`broadcaster_id\` \`broadcaster_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`music-like-count\` CHANGE \`bk_id\` \`bk_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`music-like-count\` CHANGE \`msc_id\` \`msc_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`song-request\` DROP FOREIGN KEY \`FK_418278db6be5ba3a3e28f2ffd05\``);
        await queryRunner.query(`ALTER TABLE \`song-request\` DROP FOREIGN KEY \`FK_ee9606ff6a5159a722c63e8e5cb\``);
        await queryRunner.query(`ALTER TABLE \`song-request\` DROP FOREIGN KEY \`FK_2a9386b69ac0e8c5dde8c411699\``);
        await queryRunner.query(`ALTER TABLE \`song-request\` DROP FOREIGN KEY \`FK_9520f2491adb6e893acb438641e\``);
        await queryRunner.query(`ALTER TABLE \`song-request\` CHANGE \`viewer_id\` \`viewer_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`song-request\` CHANGE \`broadcaster_id\` \`broadcaster_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`song-request\` CHANGE \`music_id\` \`music_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`song-request\` CHANGE \`book_id\` \`book_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`song-request-blacklist\` DROP FOREIGN KEY \`FK_2ce6a4b0dfbd72abb46f338def1\``);
        await queryRunner.query(`ALTER TABLE \`song-request-blacklist\` DROP FOREIGN KEY \`FK_0daeb6e2f3ddf1e0f5255c6d796\``);
        await queryRunner.query(`ALTER TABLE \`song-request-blacklist\` CHANGE \`user_id\` \`user_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`song-request-blacklist\` CHANGE \`book_id\` \`book_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`widget-playlist\` DROP FOREIGN KEY \`FK_96b0373b720e1a2e41d72e5324d\``);
        await queryRunner.query(`ALTER TABLE \`widget-playlist\` DROP FOREIGN KEY \`FK_79ac7fa1108870afc1bc94cda2a\``);
        await queryRunner.query(`ALTER TABLE \`widget-playlist\` CHANGE \`title\` \`title\` varchar(255) NOT NULL DEFAULT '새 플레이리스트 위젯'`);
        await queryRunner.query(`ALTER TABLE \`widget-playlist\` CHANGE \`user_id\` \`user_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`widget-playlist\` CHANGE \`book_id\` \`book_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`book\` DROP FOREIGN KEY \`FK_bb000cf5a4ab978e350b2cb73b1\``);
        await queryRunner.query(`ALTER TABLE \`book\` CHANGE \`custom_id\` \`custom_id\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`book\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`book\` CHANGE \`broadcaster_id\` \`broadcaster_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`music-source-original\` CHANGE \`artist_thumbnail\` \`artist_thumbnail\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`music-source-original\` CHANGE \`album_title\` \`album_title\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`music-source-original\` CHANGE \`album_thumbnail\` \`album_thumbnail\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`music-source-original\` CHANGE \`lyrics\` \`lyrics\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`music-source-original\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`music-source-melon\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`music\` DROP FOREIGN KEY \`FK_d57cae6d444b544d83d90b9c6cb\``);
        await queryRunner.query(`ALTER TABLE \`music\` DROP FOREIGN KEY \`FK_55c71ab2a82d8ed304ce1803aa5\``);
        await queryRunner.query(`ALTER TABLE \`music\` DROP FOREIGN KEY \`FK_d1eadfac09652d85b702f57c954\``);
        await queryRunner.query(`ALTER TABLE \`music\` DROP FOREIGN KEY \`FK_be6e65238247552a6a29d3bb929\``);
        await queryRunner.query(`ALTER TABLE \`music\` CHANGE \`description\` \`description\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`music\` CHANGE \`preview_url\` \`preview_url\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`music\` CHANGE \`preview_type\` \`preview_type\` enum ('YOUTUBE', 'FLAC', 'WAV', 'MP3') NULL`);
        await queryRunner.query(`ALTER TABLE \`music\` CHANGE \`mr_url\` \`mr_url\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`music\` CHANGE \`mr_type\` \`mr_type\` enum ('YOUTUBE', 'FLAC', 'WAV', 'MP3') NULL`);
        await queryRunner.query(`ALTER TABLE \`music\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`music\` CHANGE \`broadcaster_id\` \`broadcaster_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`music\` CHANGE \`bk_id\` \`bk_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`music\` CHANGE \`source_original_id\` \`source_original_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`music\` CHANGE \`source_melon_id\` \`source_melon_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_2589d4895dc2cf95ab12a3470cf\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_7adac5c0b28492eb292d4a93871\``);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`twitch_id\` \`twitch_id\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`google_id\` \`google_id\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`book-like-count\` DROP FOREIGN KEY \`FK_2d7bb565b51eee542b17c4e355b\``);
        await queryRunner.query(`ALTER TABLE \`book-like-count\` DROP FOREIGN KEY \`FK_c56dc727c79ec9477afbc37b54c\``);
        await queryRunner.query(`ALTER TABLE \`book-like-count\` CHANGE \`broadcaster_id\` \`broadcaster_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`book-like-count\` CHANGE \`bk_id\` \`bk_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`music-like\` ADD CONSTRAINT \`FK_f1ece8f29683e09cf82479abb7f\` FOREIGN KEY (\`viewer_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`music-like\` ADD CONSTRAINT \`FK_2619efd7dcd1109b43d93b5058c\` FOREIGN KEY (\`bk_id\`) REFERENCES \`book\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`music-like\` ADD CONSTRAINT \`FK_18f2eda6a92af0549a21cec9289\` FOREIGN KEY (\`msc_id\`) REFERENCES \`music\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`book-like\` ADD CONSTRAINT \`FK_e836e970feb6902a8d30f7aa61e\` FOREIGN KEY (\`viewer_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`book-like\` ADD CONSTRAINT \`FK_141db9d7c6a7d9e4de23d850443\` FOREIGN KEY (\`bk_id\`) REFERENCES \`book\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`music-like-count\` ADD CONSTRAINT \`FK_355683d297acfd74647f5399cfc\` FOREIGN KEY (\`broadcaster_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`music-like-count\` ADD CONSTRAINT \`FK_8b9502b5c1af22d8068a4626c01\` FOREIGN KEY (\`bk_id\`) REFERENCES \`book\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`music-like-count\` ADD CONSTRAINT \`FK_cf68ebad60469303b7b50f71563\` FOREIGN KEY (\`msc_id\`) REFERENCES \`music\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`song-request\` ADD CONSTRAINT \`FK_418278db6be5ba3a3e28f2ffd05\` FOREIGN KEY (\`viewer_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`song-request\` ADD CONSTRAINT \`FK_ee9606ff6a5159a722c63e8e5cb\` FOREIGN KEY (\`broadcaster_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`song-request\` ADD CONSTRAINT \`FK_2a9386b69ac0e8c5dde8c411699\` FOREIGN KEY (\`music_id\`) REFERENCES \`music\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`song-request\` ADD CONSTRAINT \`FK_9520f2491adb6e893acb438641e\` FOREIGN KEY (\`book_id\`) REFERENCES \`book\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`song-request-blacklist\` ADD CONSTRAINT \`FK_2ce6a4b0dfbd72abb46f338def1\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`song-request-blacklist\` ADD CONSTRAINT \`FK_0daeb6e2f3ddf1e0f5255c6d796\` FOREIGN KEY (\`book_id\`) REFERENCES \`book\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`widget-playlist\` ADD CONSTRAINT \`FK_96b0373b720e1a2e41d72e5324d\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`widget-playlist\` ADD CONSTRAINT \`FK_79ac7fa1108870afc1bc94cda2a\` FOREIGN KEY (\`book_id\`) REFERENCES \`book\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`book\` ADD CONSTRAINT \`FK_bb000cf5a4ab978e350b2cb73b1\` FOREIGN KEY (\`broadcaster_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`music\` ADD CONSTRAINT \`FK_d57cae6d444b544d83d90b9c6cb\` FOREIGN KEY (\`broadcaster_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`music\` ADD CONSTRAINT \`FK_55c71ab2a82d8ed304ce1803aa5\` FOREIGN KEY (\`bk_id\`) REFERENCES \`book\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`music\` ADD CONSTRAINT \`FK_d1eadfac09652d85b702f57c954\` FOREIGN KEY (\`source_original_id\`) REFERENCES \`music-source-original\`(\`song_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`music\` ADD CONSTRAINT \`FK_be6e65238247552a6a29d3bb929\` FOREIGN KEY (\`source_melon_id\`) REFERENCES \`music-source-melon\`(\`song_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_2589d4895dc2cf95ab12a3470cf\` FOREIGN KEY (\`twitch_id\`) REFERENCES \`user_twitch\`(\`twitch_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_7adac5c0b28492eb292d4a93871\` FOREIGN KEY (\`google_id\`) REFERENCES \`user_google\`(\`google_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`book-like-count\` ADD CONSTRAINT \`FK_2d7bb565b51eee542b17c4e355b\` FOREIGN KEY (\`broadcaster_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`book-like-count\` ADD CONSTRAINT \`FK_c56dc727c79ec9477afbc37b54c\` FOREIGN KEY (\`bk_id\`) REFERENCES \`book\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`book-like-count\` DROP FOREIGN KEY \`FK_c56dc727c79ec9477afbc37b54c\``);
        await queryRunner.query(`ALTER TABLE \`book-like-count\` DROP FOREIGN KEY \`FK_2d7bb565b51eee542b17c4e355b\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_7adac5c0b28492eb292d4a93871\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_2589d4895dc2cf95ab12a3470cf\``);
        await queryRunner.query(`ALTER TABLE \`music\` DROP FOREIGN KEY \`FK_be6e65238247552a6a29d3bb929\``);
        await queryRunner.query(`ALTER TABLE \`music\` DROP FOREIGN KEY \`FK_d1eadfac09652d85b702f57c954\``);
        await queryRunner.query(`ALTER TABLE \`music\` DROP FOREIGN KEY \`FK_55c71ab2a82d8ed304ce1803aa5\``);
        await queryRunner.query(`ALTER TABLE \`music\` DROP FOREIGN KEY \`FK_d57cae6d444b544d83d90b9c6cb\``);
        await queryRunner.query(`ALTER TABLE \`book\` DROP FOREIGN KEY \`FK_bb000cf5a4ab978e350b2cb73b1\``);
        await queryRunner.query(`ALTER TABLE \`widget-playlist\` DROP FOREIGN KEY \`FK_79ac7fa1108870afc1bc94cda2a\``);
        await queryRunner.query(`ALTER TABLE \`widget-playlist\` DROP FOREIGN KEY \`FK_96b0373b720e1a2e41d72e5324d\``);
        await queryRunner.query(`ALTER TABLE \`song-request-blacklist\` DROP FOREIGN KEY \`FK_0daeb6e2f3ddf1e0f5255c6d796\``);
        await queryRunner.query(`ALTER TABLE \`song-request-blacklist\` DROP FOREIGN KEY \`FK_2ce6a4b0dfbd72abb46f338def1\``);
        await queryRunner.query(`ALTER TABLE \`song-request\` DROP FOREIGN KEY \`FK_9520f2491adb6e893acb438641e\``);
        await queryRunner.query(`ALTER TABLE \`song-request\` DROP FOREIGN KEY \`FK_2a9386b69ac0e8c5dde8c411699\``);
        await queryRunner.query(`ALTER TABLE \`song-request\` DROP FOREIGN KEY \`FK_ee9606ff6a5159a722c63e8e5cb\``);
        await queryRunner.query(`ALTER TABLE \`song-request\` DROP FOREIGN KEY \`FK_418278db6be5ba3a3e28f2ffd05\``);
        await queryRunner.query(`ALTER TABLE \`music-like-count\` DROP FOREIGN KEY \`FK_cf68ebad60469303b7b50f71563\``);
        await queryRunner.query(`ALTER TABLE \`music-like-count\` DROP FOREIGN KEY \`FK_8b9502b5c1af22d8068a4626c01\``);
        await queryRunner.query(`ALTER TABLE \`music-like-count\` DROP FOREIGN KEY \`FK_355683d297acfd74647f5399cfc\``);
        await queryRunner.query(`ALTER TABLE \`book-like\` DROP FOREIGN KEY \`FK_141db9d7c6a7d9e4de23d850443\``);
        await queryRunner.query(`ALTER TABLE \`book-like\` DROP FOREIGN KEY \`FK_e836e970feb6902a8d30f7aa61e\``);
        await queryRunner.query(`ALTER TABLE \`music-like\` DROP FOREIGN KEY \`FK_18f2eda6a92af0549a21cec9289\``);
        await queryRunner.query(`ALTER TABLE \`music-like\` DROP FOREIGN KEY \`FK_2619efd7dcd1109b43d93b5058c\``);
        await queryRunner.query(`ALTER TABLE \`music-like\` DROP FOREIGN KEY \`FK_f1ece8f29683e09cf82479abb7f\``);
        await queryRunner.query(`ALTER TABLE \`book-like-count\` CHANGE \`bk_id\` \`bk_id\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`book-like-count\` CHANGE \`broadcaster_id\` \`broadcaster_id\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`book-like-count\` ADD CONSTRAINT \`FK_c56dc727c79ec9477afbc37b54c\` FOREIGN KEY (\`bk_id\`) REFERENCES \`book\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`book-like-count\` ADD CONSTRAINT \`FK_2d7bb565b51eee542b17c4e355b\` FOREIGN KEY (\`broadcaster_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`google_id\` \`google_id\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`twitch_id\` \`twitch_id\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_7adac5c0b28492eb292d4a93871\` FOREIGN KEY (\`google_id\`) REFERENCES \`user_google\`(\`google_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_2589d4895dc2cf95ab12a3470cf\` FOREIGN KEY (\`twitch_id\`) REFERENCES \`user_twitch\`(\`twitch_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`music\` CHANGE \`source_melon_id\` \`source_melon_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`music\` CHANGE \`source_original_id\` \`source_original_id\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`music\` CHANGE \`bk_id\` \`bk_id\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`music\` CHANGE \`broadcaster_id\` \`broadcaster_id\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`music\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`music\` CHANGE \`mr_type\` \`mr_type\` enum ('YOUTUBE', 'FLAC', 'WAV', 'MP3') NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`music\` CHANGE \`mr_url\` \`mr_url\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`music\` CHANGE \`preview_type\` \`preview_type\` enum ('YOUTUBE', 'FLAC', 'WAV', 'MP3') NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`music\` CHANGE \`preview_url\` \`preview_url\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`music\` CHANGE \`description\` \`description\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`music\` ADD CONSTRAINT \`FK_be6e65238247552a6a29d3bb929\` FOREIGN KEY (\`source_melon_id\`) REFERENCES \`music-source-melon\`(\`song_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`music\` ADD CONSTRAINT \`FK_d1eadfac09652d85b702f57c954\` FOREIGN KEY (\`source_original_id\`) REFERENCES \`music-source-original\`(\`song_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`music\` ADD CONSTRAINT \`FK_55c71ab2a82d8ed304ce1803aa5\` FOREIGN KEY (\`bk_id\`) REFERENCES \`book\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`music\` ADD CONSTRAINT \`FK_d57cae6d444b544d83d90b9c6cb\` FOREIGN KEY (\`broadcaster_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`music-source-melon\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`music-source-original\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`music-source-original\` CHANGE \`lyrics\` \`lyrics\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`music-source-original\` CHANGE \`album_thumbnail\` \`album_thumbnail\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`music-source-original\` CHANGE \`album_title\` \`album_title\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`music-source-original\` CHANGE \`artist_thumbnail\` \`artist_thumbnail\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`book\` CHANGE \`broadcaster_id\` \`broadcaster_id\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`book\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`book\` CHANGE \`custom_id\` \`custom_id\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`book\` ADD CONSTRAINT \`FK_bb000cf5a4ab978e350b2cb73b1\` FOREIGN KEY (\`broadcaster_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`widget-playlist\` CHANGE \`book_id\` \`book_id\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`widget-playlist\` CHANGE \`user_id\` \`user_id\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`widget-playlist\` CHANGE \`title\` \`title\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`widget-playlist\` ADD CONSTRAINT \`FK_79ac7fa1108870afc1bc94cda2a\` FOREIGN KEY (\`book_id\`) REFERENCES \`book\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`widget-playlist\` ADD CONSTRAINT \`FK_96b0373b720e1a2e41d72e5324d\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`song-request-blacklist\` CHANGE \`book_id\` \`book_id\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`song-request-blacklist\` CHANGE \`user_id\` \`user_id\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`song-request-blacklist\` ADD CONSTRAINT \`FK_0daeb6e2f3ddf1e0f5255c6d796\` FOREIGN KEY (\`book_id\`) REFERENCES \`book\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`song-request-blacklist\` ADD CONSTRAINT \`FK_2ce6a4b0dfbd72abb46f338def1\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`song-request\` CHANGE \`book_id\` \`book_id\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`song-request\` CHANGE \`music_id\` \`music_id\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`song-request\` CHANGE \`broadcaster_id\` \`broadcaster_id\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`song-request\` CHANGE \`viewer_id\` \`viewer_id\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`song-request\` ADD CONSTRAINT \`FK_9520f2491adb6e893acb438641e\` FOREIGN KEY (\`book_id\`) REFERENCES \`book\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`song-request\` ADD CONSTRAINT \`FK_2a9386b69ac0e8c5dde8c411699\` FOREIGN KEY (\`music_id\`) REFERENCES \`music\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`song-request\` ADD CONSTRAINT \`FK_ee9606ff6a5159a722c63e8e5cb\` FOREIGN KEY (\`broadcaster_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`song-request\` ADD CONSTRAINT \`FK_418278db6be5ba3a3e28f2ffd05\` FOREIGN KEY (\`viewer_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`music-like-count\` CHANGE \`msc_id\` \`msc_id\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`music-like-count\` CHANGE \`bk_id\` \`bk_id\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`music-like-count\` CHANGE \`broadcaster_id\` \`broadcaster_id\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`music-like-count\` ADD CONSTRAINT \`FK_cf68ebad60469303b7b50f71563\` FOREIGN KEY (\`msc_id\`) REFERENCES \`music\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`music-like-count\` ADD CONSTRAINT \`FK_8b9502b5c1af22d8068a4626c01\` FOREIGN KEY (\`bk_id\`) REFERENCES \`book\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`music-like-count\` ADD CONSTRAINT \`FK_355683d297acfd74647f5399cfc\` FOREIGN KEY (\`broadcaster_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`book-like\` CHANGE \`bk_id\` \`bk_id\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`book-like\` CHANGE \`viewer_id\` \`viewer_id\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`book-like\` ADD CONSTRAINT \`FK_141db9d7c6a7d9e4de23d850443\` FOREIGN KEY (\`bk_id\`) REFERENCES \`book\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`book-like\` ADD CONSTRAINT \`FK_e836e970feb6902a8d30f7aa61e\` FOREIGN KEY (\`viewer_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`music-like\` CHANGE \`msc_id\` \`msc_id\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`music-like\` CHANGE \`bk_id\` \`bk_id\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`music-like\` CHANGE \`viewer_id\` \`viewer_id\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`music-like\` ADD CONSTRAINT \`FK_18f2eda6a92af0549a21cec9289\` FOREIGN KEY (\`msc_id\`) REFERENCES \`music\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`music-like\` ADD CONSTRAINT \`FK_2619efd7dcd1109b43d93b5058c\` FOREIGN KEY (\`bk_id\`) REFERENCES \`book\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`music-like\` ADD CONSTRAINT \`FK_f1ece8f29683e09cf82479abb7f\` FOREIGN KEY (\`viewer_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_google\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user_google\` CHANGE \`google_display_name\` \`google_display_name\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user_twitch\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user_twitch\` CHANGE \`twitch_refresh_token\` \`twitch_refresh_token\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user_twitch\` CHANGE \`twitch_broadcaster_type\` \`twitch_broadcaster_type\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user_twitch\` CHANGE \`twitch_type\` \`twitch_type\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user_twitch\` CHANGE \`twitch_created_at\` \`twitch_created_at\` timestamp NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user_twitch\` CHANGE \`twitch_offline_img_url\` \`twitch_offline_img_url\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user_twitch\` CHANGE \`twitch_description\` \`twitch_description\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user_twitch\` CHANGE \`twitch_display_name\` \`twitch_display_name\` varchar(255) NULL DEFAULT 'NULL'`);
    }

}
