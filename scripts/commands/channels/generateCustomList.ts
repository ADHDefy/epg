import { ChannelsParser } from 'scripts/core'; // Adjust based on where it's defined
import * as xml2js from 'xml2js';  // Import xml2js to parse or generate XML
import { Logger, Storage, Collection } from '@freearhey/core';
import path from 'path';
import { SITES_DIR } from '../../constants';
import fs from 'fs';

async function generateCustomChannelList() {
  const logger = new Logger();

  // Your logic for generating the custom channel list
  logger.start('generating custom channel list...');
  const storage = new Storage();
  const parser = new ChannelsParser({ storage });

  let files = await storage.list(path.join(SITES_DIR, '*.channels.xml'));
  let parsedChannels = new Collection();
  
  // Parsing channels
  for (const filepath of files) {
    parsedChannels = parsedChannels.concat(await parser.parse(filepath));
  }

  const channelList: { channel: string }[] = parsedChannels.map((channel) => ({
    channel: channel.name,
  }));

  // Writing to XML
  const builder = new xml2js.Builder();
  const xml = builder.buildObject({ channels: { channel: channelList } });

  fs.writeFileSync('custom_channels.xml', xml);
  logger.success('Custom channel list generated!');
}

generateCustomChannelList().catch((err) => console.error(err));
