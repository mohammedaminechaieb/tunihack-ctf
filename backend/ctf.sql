DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS user_gates;
DROP TABLE IF EXISTS challenges;

-- Users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    category TEXT,
    difficulty INTEGER DEFAULT 2,
    points INTEGER DEFAULT 0,
    joined DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User gates table
CREATE TABLE user_gates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    gate_id INTEGER NOT NULL,
    UNIQUE(user_id, gate_id),
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Challenges table
CREATE TABLE challenges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT,
    description TEXT,
    resource_url TEXT,
    flag TEXT
);

INSERT INTO challenges (name, category, description, resource_url, flag) VALUES
('Gate 1 – Are You Even Here?', 'Forensics', 'Before going deeper...', 'downloads/gate1.zip', 'TUNIHACK{JUST-TaS5IN-0U_B4RRA}'),
('Cleartext Credentials', 'Networks', 'Someone really logged in...', 'downloads/gate2.zip', 'TUNIHACK{PCAP_HTTP_IS_DANGEROUS}'),
('Gate 3', 'Crypto', 'manouba is such a color...', 'downloads/gate3.zip', 'TUNIHACK{RAZI_NEVER_WAS_CALM}'),
('Hidden Nmap Analysis', 'Forensics', 'The key is: nmap', 'downloads/gate4.zip', 'TUNIHACK{NMAP_IS_NOT_JUST_PORTS}'),
('Gate 5', 'Reverse', 'dragon', 'downloads/gate5.zip', 'TUNIHACK{EJ4AW_TAWA_BD4}'),
('Gate 6', 'Reverse', 'We lost the flag—but not really...', 'downloads/gate6.zip', 'TUNIHACK{EJ4AW_TAWA_BD4_2}'),
('Gate 7', 'Only for smart ones', 'Just answer', 'downloads/gate7.zip', 'TUNIHACK{RAFEH}');

