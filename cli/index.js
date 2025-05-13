#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

// Define text styling functions (simple version without chalk dependency)
const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m",
    bold: "\x1b[1m"
};

const log = {
    success: (text) => console.log(`${colors.green}✓ ${text}${colors.reset}`),
    error: (text) => console.log(`${colors.red}✖ ${text}${colors.reset}`),
    info: (text) => console.log(`${colors.blue}${text}${colors.reset}`),
    title: (text) => console.log(`\n${colors.bold}${text}${colors.reset}\n`),
    code: (text) => console.log(`${colors.cyan}${text}${colors.reset}`)
};

// Define component configuration
const components = {
    button: {
        name: 'Button',
        files: [
            {
                src: path.join(__dirname, '../components/ui/button/button.tsx'),
                dest: 'components/ui/button/button.tsx',
            },
            {
                src: path.join(__dirname, '../components/ui/button/index.ts'),
                dest: 'components/ui/button/index.ts',
            },
        ],
        dependencies: [], // Add any dependencies if needed
    },
    // You can add more components here as you develop them
};

// Function to install the component
async function installComponent(component) {
    // Check if the component exists
    if (!components[component]) {
        log.error(`Component ${colors.bold}${component}${colors.reset}${colors.red} not found`);
        process.exit(1);
    }

    const componentConfig = components[component];

    // Create the necessary directories and copy the files
    for (const file of componentConfig.files) {
        const srcPath = file.src;
        const destPath = path.join(process.cwd(), file.dest);

        // Create directory if it doesn't exist
        try {
            await fs.ensureDir(path.dirname(destPath));
        } catch (error) {
            log.error(`Failed to create directory for ${file.dest}`);
            console.error(error);
            process.exit(1);
        }

        // Copy the file
        try {
            await fs.copy(srcPath, destPath);
            log.success(`Created ${colors.bold}${file.dest}`);
        } catch (error) {
            log.error(`Failed to copy file to ${file.dest}`);
            console.error(error);
            process.exit(1);
        }
    }

    // Install dependencies if needed
    if (componentConfig.dependencies.length > 0) {
        log.info('\nInstalling dependencies...');

        try {
            execSync(`npm install ${componentConfig.dependencies.join(' ')}`, {
                stdio: 'inherit'
            });
            log.success('Dependencies installed');
        } catch (error) {
            log.error('Failed to install dependencies');
            console.error(error);
        }
    }

    log.success(`\n${colors.bold}${componentConfig.name}${colors.reset}${colors.green} installed successfully`);

    // Usage example
    log.title('Usage Example:');
    if (component === 'button') {
        log.code(`
import { Button } from '../components/ui/button';

export default function MyComponent() {
  return (
    <Button onPress={() => console.log('Button pressed')}>
      Click Me
    </Button>
  );
}
`);
    }
}

// Main function
async function main() {
    // Check arguments
    const args = process.argv.slice(2);

    if (args[0] === 'add') {
        // Handle 'add' command
        const componentToAdd = args[1];

        if (!componentToAdd) {
            // If no component specified, show available components
            log.error('No component specified');
            console.log('Available components:');
            Object.keys(components).forEach(name => {
                console.log(`  - ${name}`);
            });
            process.exit(1);
        } else {
            // Install the specified component
            await installComponent(componentToAdd);
        }
    } else if (args[0] === 'init') {
        // Handle 'init' command - you can expand this to set up a config file if needed
        log.success('Initialized components-rn in the current project');
    } else {
        // Show help
        log.title('Components-RN CLI for React Native');
        console.log(`${colors.bold}Usage:${colors.reset}`);
        console.log('  npx components-rn add [component]');
        console.log('  npx components-rn init');
        console.log('');
        console.log(`${colors.bold}Available components:${colors.reset}`);
        console.log(`  ${Object.keys(components).join(', ')}`);
    }
}

// Run the main function
main().catch(error => {
    log.error('An error occurred:');
    console.error(error);
    process.exit(1);
});