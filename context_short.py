import os
import re
import fnmatch

# --- CONFIGURATION ---

# 1. Dossiers et Fichiers à IGNORER totalement
IGNORE_PATTERNS = {
    'node_modules', '.next', '.git', '.venv', '__pycache__', 
    'dist', 'build', '.turbo', 'yarn.lock', 'package-lock.json', 
    'pnpm-lock.yaml', '*.png', '*.jpg', '*.jpeg', '*.svg', '*.ico',
    '.DS_Store', 'LICENSE', 'venv'
}

# 2. Fichiers CRITIQUES à lire EN ENTIER (High Context)
# Mettez ici les fichiers qui contiennent la "vérité" du projet (Schémas, Auth, Config)
CRITICAL_FILES = {
    'schema.prisma',
    'docker-compose.yml',
    'auth.config.ts',
    'middleware.ts',
    'next.config.js',
    'tsconfig.json',
    'package.json',
    'main.py', # Entry point Python
    'route.ts' # Souvent les définitions d'API
}

# 3. Extensions à traiter
EXTENSIONS = {'.ts', '.tsx', '.js', '.jsx', '.py', '.prisma', '.json', '.yml', '.yaml', '.md'}

OUTPUT_FILE = "SMART_CONTEXT.md"

def is_ignored(path):
    for pattern in IGNORE_PATTERNS:
        if fnmatch.fnmatch(os.path.basename(path), pattern):
            return True
        # Vérifie aussi si un dossier parent est ignoré
        parts = path.split(os.sep)
        for part in parts:
            if fnmatch.fnmatch(part, pattern):
                return True
    return False

def get_tree(startpath):
    tree_str = "### 📂 PROJECT STRUCTURE\n```\n"
    for root, dirs, files in os.walk(startpath):
        if is_ignored(root):
            dirs[:] = [] # Don't descend
            continue
            
        level = root.replace(startpath, '').count(os.sep)
        indent = '│   ' * (level - 1) + '├── ' if level > 0 else ''
        if level == 0: indent = ''
        
        tree_str += f"{indent}{os.path.basename(root)}/\n"
        
        subindent = '│   ' * level + '├── '
        for f in sorted(files):
            if not is_ignored(f) and any(f.endswith(ext) for ext in EXTENSIONS):
                tree_str += f"{subindent}{f}\n"
    tree_str += "```\n\n"
    return tree_str

def skeletonize_code(content, extension):
    """
    Réduit le code à sa structure essentielle (Imports, Signatures, Types).
    """
    lines = content.split('\n')
    skeleton = []
    
    # Regex simples pour détecter les structures importantes
    # TS/JS: export, import, interface, type, function, class, const X = (
    ts_pattern = re.compile(r'^\s*(export|import|interface|type|class|@|async|function|const.*=.*=>|const.*=.*function)')
    # Python: def, class, import, from, @
    py_pattern = re.compile(r'^\s*(def |class |@|import |from )')
    
    in_critical_block = False # Pour garder les débuts de fichiers souvent importants

    for i, line in enumerate(lines):
        stripped = line.strip()
        
        # Garder les 10 premières lignes (imports souvent)
        if i < 15:
            skeleton.append(line)
            continue

        # Garder les commentaires (documentation)
        if stripped.startswith('//') or stripped.startswith('#') or stripped.startswith('/*') or stripped.startswith('*'):
            skeleton.append(line)
            continue

        # Détection selon langage
        keep = False
        if extension in ['.ts', '.tsx', '.js', '.jsx']:
            if ts_pattern.match(line): keep = True
            if 'z.object' in line: keep = True # Garder les schémas Zod
        elif extension == '.py':
            if py_pattern.match(line): keep = True
            
        if keep:
            skeleton.append(line)
            # Ajouter une ligne vide ou "..." si la ligne précédente ne l'était pas déjà
            if "{" in line or ":" in line: 
                indent = line[:len(line)-len(stripped)]
                skeleton.append(f"{indent}  // ... implementation hidden for brevity ...")
        
        # Garder les accolades fermantes pour la structure visuelle
        if stripped == '}' or stripped == '};' or stripped == ')':
            skeleton.append(line)

    return "\n".join(skeleton)

def generate_smart_context():
    output = "# 🧠 SMART CONTEXT FOR AI AGENT\n"
    output += "> Ce fichier contient une version compressée du code source. Les fichiers critiques sont complets, les autres sont squelettisés (signatures uniquement).\n\n"
    
    root_dir = os.getcwd()
    
    # 1. Structure
    print("Generating Tree...")
    output += get_tree(root_dir)
    
    # 2. Contenu
    print("Reading Files...")
    token_estimator = 0
    
    for root, dirs, files in os.walk(root_dir):
        if is_ignored(root):
            dirs[:] = []
            continue
            
        for file in sorted(files):
            if is_ignored(file): continue
            
            _, ext = os.path.splitext(file)
            if ext not in EXTENSIONS: continue
            
            filepath = os.path.join(root, file)
            relpath = os.path.relpath(filepath, root_dir)
            
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                is_critical = file in CRITICAL_FILES or relpath.startswith('packages/database/prisma')
                
                output += f"\n{'='*60}\n"
                output += f"FILE: {relpath} {'(FULL)' if is_critical else '(SKELETON)'}\n"
                output += f"{'='*60}\n"
                output += f"```{ext.replace('.', '')}\n"
                
                if is_critical or ext in ['.json', '.prisma', '.yml', '.yaml']:
                    # Pas de compression pour les fichiers critiques ou de config pure
                    output += content
                else:
                    # Compression intelligente
                    output += skeletonize_code(content, ext)
                    
                output += "\n```\n"
                
                # Estimation très grossière (1 mot ~ 1.3 tokens, code est dense)
                token_estimator += len(content) / 4
                
            except Exception as e:
                print(f"Error reading {file}: {e}")

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(output)
        
    print(f"✅ Success! Smart Context saved to {OUTPUT_FILE}")
    print(f"📊 Estimated RAW Token count (before compression): {int(token_estimator)}")
    print(f"📉 Check the file size of {OUTPUT_FILE} to see compression ratio.")

if __name__ == "__main__":
    generate_smart_context()