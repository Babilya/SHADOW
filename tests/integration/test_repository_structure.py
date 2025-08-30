"""
Sample integration test for repository structure validation.

This test ensures that the repository follows the expected structure
and that key components are properly organized.
"""

import os
import pytest
from pathlib import Path


class TestRepositoryStructure:
    """Test repository structure and organization."""
    
    @pytest.fixture
    def repo_root(self):
        """Get the repository root path."""
        current_file = Path(__file__)
        # Navigate up from tests/integration/test_repository_structure.py to root
        return current_file.parent.parent.parent
    
    def test_root_documentation_files_exist(self, repo_root):
        """Test that required documentation files exist at root level."""
        required_files = [
            'README.md',
            'CONTRIBUTING.md', 
            'LICENSE'
        ]
        
        for file_name in required_files:
            file_path = repo_root / file_name
            assert file_path.exists(), f"Required file {file_name} not found at root level"
            assert file_path.stat().st_size > 0, f"File {file_name} is empty"
    
    def test_standard_directories_exist(self, repo_root):
        """Test that standard project directories exist."""
        required_dirs = [
            'docs',
            'src', 
            'tests',
            'quantumx'  # Main project directory
        ]
        
        for dir_name in required_dirs:
            dir_path = repo_root / dir_name
            assert dir_path.exists(), f"Required directory {dir_name} not found"
            assert dir_path.is_dir(), f"{dir_name} exists but is not a directory"
    
    def test_docs_structure(self, repo_root):
        """Test that docs directory has proper structure."""
        docs_dir = repo_root / 'docs'
        
        # Check for main docs README
        assert (docs_dir / 'README.md').exists(), "docs/README.md not found"
        
        # Check for key documentation subdirectories
        expected_subdirs = ['api', 'development']
        for subdir in expected_subdirs:
            subdir_path = docs_dir / subdir
            assert subdir_path.exists(), f"docs/{subdir} directory not found"
            assert (subdir_path / 'README.md').exists(), f"docs/{subdir}/README.md not found"
    
    def test_tests_structure(self, repo_root):
        """Test that tests directory has proper structure."""
        tests_dir = repo_root / 'tests'
        
        # Check for main tests README
        assert (tests_dir / 'README.md').exists(), "tests/README.md not found"
        
        # Check for test subdirectories
        expected_subdirs = ['unit', 'integration', 'e2e']
        for subdir in expected_subdirs:
            subdir_path = tests_dir / subdir
            assert subdir_path.exists(), f"tests/{subdir} directory not found"
    
    def test_src_structure(self, repo_root):
        """Test that src directory has proper structure."""
        src_dir = repo_root / 'src'
        
        # Check for main src README
        assert (src_dir / 'README.md').exists(), "src/README.md not found"
    
    def test_quantumx_structure_preserved(self, repo_root):
        """Test that existing QuantumX structure is preserved."""
        quantumx_dir = repo_root / 'quantumx'
        
        # Check for QuantumX README
        assert (quantumx_dir / 'README.md').exists(), "quantumx/README.md not found"
        
        # Check for QuantumX main directories
        expected_dirs = ['apps', 'packages']
        for dir_name in expected_dirs:
            dir_path = quantumx_dir / dir_name
            assert dir_path.exists(), f"quantumx/{dir_name} directory not found"
        
        # Check for specific apps
        apps_dir = quantumx_dir / 'apps'
        expected_apps = ['backend', 'bot', 'web']
        for app in expected_apps:
            app_path = apps_dir / app
            assert app_path.exists(), f"quantumx/apps/{app} not found"
        
        # Check for backend tests
        backend_tests = apps_dir / 'backend' / 'tests'
        assert backend_tests.exists(), "Backend tests directory not found"
    
    def test_scripts_directory(self, repo_root):
        """Test that scripts directory exists and contains automation scripts."""
        scripts_dir = repo_root / 'scripts'
        assert scripts_dir.exists(), "scripts directory not found"
        
        # Check for automated checks script
        automated_checks = scripts_dir / 'automated_checks.sh'
        assert automated_checks.exists(), "automated_checks.sh not found"


if __name__ == '__main__':
    pytest.main([__file__])