import { ChannelsParser } from 'scripts/core'; // Adjust based on where it's defined
import { Channel } from 'epg-grabber'; // Adjust based on where it's defined
import { Logger, Storage, Collection } from '@freearhey/core'
import path from 'path'
import { SITES_DIR } from '../../constants'
import fs from 'fs'
import xml2js from 'xml2js'

async function generateCustomChannelList(siteName: string, outputPath: string) {
  const logger = new Logger()

  logger.start('Generating custom channels list...')
  
  const storage = new Storage()

  // Fetch the channel XML files from the specified site
  let pattern = path.join(SITES_DIR, siteName, '*.channels.xml')
  pattern = pattern.replace(/\\/g, '/')
  
  const files = await storage.list(pattern)

  if (files.length === 0) {
    logger.error(`No channel files found for site: ${siteName}`)
    return
  }

  let channels = new Collection()
  const parser = new ChannelsParser({ storage })

  for (const filepath of files) {
    channels = channels.concat(await parser.parse(filepath))
  }

  logger.info(`Found ${channels.count()} channel(s)`)

  // Create XML structure
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<channels>
${channels
    .map((channel: Channel) => {
      return `  <channel site="${channel.site}" lang="${channel.lang}" xmltv_id="${channel.xmltv_id}" site_id="${channel.site_id}">
    ${channel.name}
  </channel>`
    })
    .join('\n')}
</channels>`

  // Write the XML content to the specified output file
  fs.writeFileSync(outputPath, xmlContent)
  logger.success(`Custom channel list written to ${outputPath}`)
}

// Call the function
generateCustomChannelList('arirang.com', 'custom_channels.xml')
